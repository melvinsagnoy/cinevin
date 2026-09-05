'use client'

import { useState } from 'react'
import { videoServers, VideoServer } from '@/config/video-servers'
import { cn } from '@/lib/utils/cn'

interface ServerSelectorProps {
  mediaType: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
  onServerChange?: (serverId: string) => void
  currentServerId?: string
}

export function ServerSelector({
  mediaType,
  tmdbId,
  season,
  episode,
  onServerChange,
  currentServerId = 'vidsrcpro',
}: ServerSelectorProps) {
  const [selectedServerId, setSelectedServerId] = useState(currentServerId)

  const handleServerSelect = (server: VideoServer) => {
    setSelectedServerId(server.id)
    if (onServerChange) {
      onServerChange(server.id)
    }
  }

  const availableServers = videoServers.filter(server => server.enabled)
  const selectedServer = availableServers.find(s => s.id === selectedServerId) || availableServers[0]

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-400">Select Server</h3>
      <div className="flex flex-wrap gap-2">
        {availableServers.map((server) => (
          <button
            key={server.id}
            onClick={() => handleServerSelect(server)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition',
              selectedServerId === server.id
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            )}
          >
            {server.name}
          </button>
        ))}
      </div>
    </div>
  )
}