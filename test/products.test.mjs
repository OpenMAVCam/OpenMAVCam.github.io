import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';

test('D64TR data includes dual-sensor compute and connectivity specifications', async () => {
  const data = await readFile('src/data/products/d64tr.ts', 'utf8');
  for (const value of ['D64TR', 'FLIR Boson+ 640 × 512', '8 GB LPDDR5', '128 GB UFS', 'Gigabit Ethernet', '1080p HDMI output']) {
    assert.match(data, new RegExp(value.replace(/[+]/g, '\\+')));
  }
});
