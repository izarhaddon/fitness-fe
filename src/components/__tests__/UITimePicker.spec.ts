// src/components/__tests__/UITimePicker.spec.ts

import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  it,
} from 'vitest'
import UITimePicker from '@/components/UITimePicker.vue'

function mountPicker() {
  return mount(
    UITimePicker,
    {
      props: {
        id: 'time',
        name: 'time',
        label: 'Время',
        time: new Date(
          2026,
          10,
          11,
          18,
          45,
        ),
      },
    },
  )
}

async function pick(value: string) {
  const wrapper = mountPicker()
  const input = wrapper.get('input[type="time"]')
  // setValue сам генерирует change для input
  await input.setValue(value)

  return wrapper.emitted('update:time') as [Date][] | undefined
}

describe(
  'UITimePicker',
  () => {
    it.each([
      [
        '10:00',
        10,
        0,
      ],
      [
        '00:30',
        0,
        30,
      ],
      [
        '00:00',
        0,
        0,
      ],
      [
        '23:59',
        23,
        59,
      ],
    ])(
      'выбор %s отдаёт время с часами %i и минутами %i',
      async (value, hours, minutes) => {
        const emitted = await pick(value)

        expect(emitted).toHaveLength(1)
        const time = emitted![0]![0]
        expect(time.getHours()).toBe(hours)
        expect(time.getMinutes()).toBe(minutes)
        expect(time.getSeconds()).toBe(0)
      },
    )

    it(
      'очищенное поле не отдаёт событие',
      async () => {
        const emitted = await pick('')

        expect(emitted).toBeUndefined()
      },
    )
  },
)
