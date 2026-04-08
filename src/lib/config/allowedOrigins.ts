const parseOrigins = (value?: string): string[] => {
  if (!value) {
    return []
  }

  return Array.from(
    new Set(
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  )
}

export const getAllowedOrigins = (): string[] => {
  return parseOrigins(process.env.N8N_ALLOWED_ORIGINS)
}
