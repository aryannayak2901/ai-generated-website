import { useState, useEffect } from 'react'
import { PROVIDERS, AI_SETTINGS_KEY, DEFAULT_PROVIDER } from '@/lib/ai/providers'
import type { AISettings } from '@/lib/ai/types'

export function useAISettings() {
  const [settings, setSettings] = useState<AISettings>({
    provider: DEFAULT_PROVIDER,
    model: PROVIDERS[DEFAULT_PROVIDER].models[0].value,
    apiKey: '',
  })
  
  const [isInitialized, setIsInitialized] = useState(false)
  const [dynamicModels, setDynamicModels] = useState<Record<string, { value: string; label: string }[]>>({})
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  // Load initial settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AI_SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as AISettings
        if (parsed.provider && PROVIDERS[parsed.provider]) {
          setSettings(parsed)
        }
      }
    } catch { /* ignore */ }
    setIsInitialized(true)
  }, [])

  // Save on change
  useEffect(() => {
    if (!isInitialized) return
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings))
      } catch { /* ignore */ }
    }, 500)
    return () => clearTimeout(timeout)
  }, [settings, isInitialized])

  // Fetch OpenRouter models dynamically
  useEffect(() => {
    async function fetchOpenRouterModels() {
      if (dynamicModels['openrouter']) return
      setIsLoadingModels(true)
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models')
        if (res.ok) {
          const data = await res.json()
          const models = data.data
            .map((m: any) => ({
              value: m.id,
              label: m.name || m.id,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label))
          
          setDynamicModels(prev => ({ ...prev, openrouter: models }))
        }
      } catch (err) {
        console.error('Failed to fetch OpenRouter models:', err)
      } finally {
        setIsLoadingModels(false)
      }
    }

    if (settings.provider === 'openrouter') {
      fetchOpenRouterModels()
    }
  }, [settings.provider, dynamicModels])

  const updateSettings = (newSettings: Partial<AISettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      // If provider changes and there's no new model specified, pick the default for the new provider
      if (newSettings.provider && !newSettings.model && newSettings.provider !== prev.provider) {
        const defaultModel = PROVIDERS[newSettings.provider].models[0]?.value || ''
        updated.model = defaultModel
      }
      return updated
    })
  }

  return {
    settings,
    updateSettings,
    dynamicModels,
    isLoadingModels,
    isInitialized,
  }
}
