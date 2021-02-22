/*
 * edge-supercharged
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import './assert-extend'

import test from 'japa'
import { join } from 'path'
import { Edge } from 'edge.js'
import { Supercharged } from '../index'
import { readdirSync, readFileSync, statSync } from 'fs'

const basePath = join(__dirname, '../fixtures')

test.group('Fixtures', () => {
  const dirs = readdirSync(basePath).filter((file) => statSync(join(basePath, file)).isDirectory())

  dirs.forEach((dir) => {
    const dirBasePath = join(basePath, dir)
    test(dir, (assert) => {
      const edge = new Edge()
      const supercharged = new Supercharged()

      edge.mount(dirBasePath)
      edge.use(supercharged.wire)

      const out = readFileSync(join(dirBasePath, 'index.txt'), 'utf-8')
      const state = JSON.parse(readFileSync(join(dirBasePath, 'index.json'), 'utf-8'))

      const output = edge.render('index.edge', state)
      const rawOutput = edge.renderRaw(
        readFileSync(join(dirBasePath, 'index.edge'), 'utf-8'),
        state
      )
      assert.stringEqual(output.trim(), out)
      assert.stringEqual(rawOutput.trim(), out)
    })
  })
})
