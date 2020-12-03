/*
 * edge
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'
import { Supercharged } from '../src/Supercharged'

const fs = new Filesystem(join(__dirname, '__app'))

test.group('SuperCharged', (group) => {
	group.afterEach(async () => {
		await fs.cleanup()
	})

	test('discover components from a given directory', async (assert) => {
		await fs.add('components/form/input.edge', '')
		await fs.add('components/form/label.edge', '')
		await fs.add('components/form/button.edge', '')
		await fs.add('components/modal.edge', '')

		const charged = new Supercharged()
		charged.discoverComponents(fs.basePath)

		assert.deepEqual(charged.components, {
			'form.button': {
				path: 'components/form/button.edge',
			},
			'form.label': {
				path: 'components/form/label.edge',
			},
			'form.input': {
				path: 'components/form/input.edge',
			},
			'modal': {
				path: 'components/modal.edge',
			},
		})
	})

	test('convert file path to camelcase', async (assert) => {
		await fs.add('components/form-input.edge', '')
		await fs.add('components/form-label.edge', '')
		await fs.add('components/form-button.edge', '')
		await fs.add('components/modal.edge', '')

		const charged = new Supercharged()
		charged.discoverComponents(fs.basePath)

		assert.deepEqual(charged.components, {
			formButton: {
				path: 'components/form-button.edge',
			},
			formLabel: {
				path: 'components/form-label.edge',
			},
			formInput: {
				path: 'components/form-input.edge',
			},
			modal: {
				path: 'components/modal.edge',
			},
		})
	})

	test('define custom prefix', async (assert) => {
		await fs.add('components/form-input.edge', '')
		await fs.add('components/form-label.edge', '')
		await fs.add('components/form-button.edge', '')
		await fs.add('components/modal.edge', '')

		const charged = new Supercharged()
		charged.discoverComponents(fs.basePath, { prefix: 'hl' })

		assert.deepEqual(charged.components, {
			'hl.formButton': {
				path: 'components/form-button.edge',
			},
			'hl.formLabel': {
				path: 'components/form-label.edge',
			},
			'hl.formInput': {
				path: 'components/form-input.edge',
			},
			'hl.modal': {
				path: 'components/modal.edge',
			},
		})
	})

	test('define custom disk name', async (assert) => {
		await fs.add('components/form-input.edge', '')
		await fs.add('components/form-label.edge', '')
		await fs.add('components/form-button.edge', '')
		await fs.add('components/modal.edge', '')

		const charged = new Supercharged()
		charged.discoverComponents(fs.basePath, { prefix: 'hl', diskName: 'hl' })

		assert.deepEqual(charged.components, {
			'hl.formButton': {
				path: 'hl::components/form-button.edge',
			},
			'hl.formLabel': {
				path: 'hl::components/form-label.edge',
			},
			'hl.formInput': {
				path: 'hl::components/form-input.edge',
			},
			'hl.modal': {
				path: 'hl::components/modal.edge',
			},
		})
	})

	test('handle filenames with . in them', async (assert) => {
		await fs.add('components/form.input.edge', '')
		await fs.add('components/form.label.edge', '')
		await fs.add('components/form.button.edge', '')
		await fs.add('components/modal.edge', '')

		const charged = new Supercharged()
		charged.discoverComponents(fs.basePath)

		assert.deepEqual(charged.components, {
			formButton: {
				path: 'components/form.button.edge',
			},
			formLabel: {
				path: 'components/form.label.edge',
			},
			formInput: {
				path: 'components/form.input.edge',
			},
			modal: {
				path: 'components/modal.edge',
			},
		})
	})
})
