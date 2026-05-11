'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@/payload.config'
import { importMap } from './admin/importMap'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverFunction = async function (args: any) {
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}
