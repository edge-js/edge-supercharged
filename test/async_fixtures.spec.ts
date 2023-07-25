/*
 * edge-supercharged
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import './assert_extend.js'

import { test } from '@japa/runner'
import { dirname, join } from 'node:path'
import { Edge } from 'edge.js'
import { Supercharged } from '../index.js'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const basePath = join(dirname(fileURLToPath(import.meta.url)), '../async_fixtures')

test.group('Async Fixtures', () => {
  const dirs = readdirSync(basePath).filter((file) => statSync(join(basePath, file)).isDirectory())

  dirs.forEach((dir) => {
    const dirBasePath = join(basePath, dir)
    test(dir, async ({ assert }) => {
      const edge = new Edge()
      const supercharged = new Supercharged()

      edge.mount(dirBasePath)
      edge.use(supercharged.wire)

      const out = readFileSync(join(dirBasePath, 'index.txt'), 'utf-8')
      const state = JSON.parse(readFileSync(join(dirBasePath, 'index.json'), 'utf-8'))

      const output = await edge.render('index.edge', state)
      const rawOutput = await edge.renderRaw(
        readFileSync(join(dirBasePath, 'index.edge'), 'utf-8'),
        state
      )
      assert.stringEqual(output.trim(), out)
      assert.stringEqual(rawOutput.trim(), out)
    })
  })
})
