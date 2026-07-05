import '@payloadcms/next/css'
import './custom-admin.css'
import config from '@/payload.config'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap'
import { serverFunction } from './serverFunction'
import { getPayload } from 'payload'
import { generateAdminCSS } from '@/globals/ThemeSettings/hooks/generateAdminCSS'

type Args = {
  children: React.ReactNode
}

const Layout = async ({ children }: Args) => {
  let adminCss = ''
  try {
    const payload = await getPayload({ config })
    const theme = await payload.findGlobal({
      slug: 'theme-settings',
      depth: 0,
    })
    if (theme) {
      adminCss = generateAdminCSS(theme)
    }
  } catch (err) {
    console.error('Failed to load admin theme settings:', err)
  }

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {adminCss && (
        <style
          id="payload-admin-theme-overrides"
          dangerouslySetInnerHTML={{ __html: adminCss }}
        />
      )}
      {children}
    </RootLayout>
  )
}

export default Layout
