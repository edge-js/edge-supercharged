/*
 * edge-supercharged
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import slash from 'slash'
import { join } from 'path'
import { Edge } from 'edge.js'
import { fsReadAll, string } from '@poppinss/utils/build/helpers'

/**
 * Allows registering components path with an easy to use name
 */
export class Supercharged {
  /**
   * List of registered components
   */
  public components: {
    [name: string]: {
      path: string
    }
  } = {}

  /**
   * Plugin fn for edge
   */
  public wire = (edge: Edge, firstRun: boolean) => {
    /**
     * Reset components on each run. The "discoverComponents"
     * calls will collect them
     */
    this.components = {}

    Object.keys(edge.loader.mounted).forEach((diskName) => {
      if (diskName === 'default') {
        this.discoverComponents(edge.loader.mounted[diskName])
      } else {
        this.discoverComponents(edge.loader.mounted[diskName], {
          prefix: diskName,
          diskName: diskName,
        })
      }
    })

    /**
     * Do not re-run the following code when it is a recurring
     * run
     */
    if (!firstRun) {
      return
    }

    /**
     * Claim tags registered with supercharged
     */
    edge.compiler.claimTag((name) => {
      if (this.components[name]) {
        return { seekable: true, block: true }
      }
      return null
    })
    edge.asyncCompiler.claimTag((name) => {
      if (this.components[name]) {
        return { seekable: true, block: true }
      }
      return null
    })

    /**
     * Process tags
     */
    edge.processor.process('tag', ({ tag }) => {
      const component = this.components[tag.properties.name]
      if (!component) {
        return
      }

      tag.properties.name = 'component'
      if (tag.properties.jsArg.trim() === '') {
        tag.properties.jsArg = `'${component.path}'`
      } else {
        tag.properties.jsArg = `'${component.path}',${tag.properties.jsArg}`
      }
    })
  }

  /**
   * Register a component
   */
  public registerComponent(name: string, path: string): this {
    this.components[name] = { path }
    return this
  }

  /**
   * Discover components from a given directory
   */
  public discoverComponents(
    basePath: string,
    options: {
      prefix?: string
      diskName?: string
    } = {}
  ): this {
    const components = fsReadAll(join(basePath, 'components'), (file) => file.endsWith('.edge'))
    options.prefix = options.prefix ? options.prefix : options.diskName

    components.forEach((file) => {
      file = slash(file)

      const name = file
        .replace(/\.edge$/, '') // Drop extension
        .split('/') // Split path
        .map((segment) => string.camelCase(segment)) // Convert each segment to camelCase
        .join('.') // Join by .

      /**
       * Add prefix to name when defined
       */
      const prefixedName = options.prefix ? `${options.prefix}.${name}` : name

      /**
       * Do not normalize the path here. Edge wants unix style paths
       */
      const componentPath = `${options.diskName ? `${options.diskName}::` : ''}components/${file}`

      /**
       * Register the component
       */
      this.registerComponent(prefixedName, componentPath)

      /**
       * Register components with `.index` with the parent name. Doing this can also
       * run into race conditions as described below
       *
       * - There is a file called `components/modal.edge`
       * - Then there is a file called `components/modal/index.edge`
       * - The file discovered later will win over the file discovered first.
       *
       * So is this a bad practice?? Not really. Coz someone creating directory structure
       * like this themselves opting into the confusion of which component they are
       * intending to use.
       *
       * Infact this race condition will force them to re-think the directory structure. Something
       * they should
       */
      if (name.endsWith('.index')) {
        this.registerComponent(prefixedName.replace(/\.index$/, ''), componentPath)
      }
    })

    return this
  }
}
