"use client"

import { useEffect, useRef, useState } from "react"
import { ConsoleClear } from "@/components/console-clear"

interface MessagePart {
  type: string
  text?: string
}

interface Message {
  id: string
  role: string
  parts: MessagePart[]
}

interface ConsoleLogsProps {
  readonly model: string
  readonly messages: readonly Message[]
  readonly status: string
  readonly webSearch: boolean
  readonly isVisible: boolean
}

interface LogEntry {
  id: string
  timestamp: Date
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR'
  message: string
  data?: Record<string, unknown> | string | number | boolean
}

// Production-grade logging utility that works in both development and production
class Logger {
  private static logs: LogEntry[] = []
  private static readonly maxLogs = 1000
  private static listeners: ((logs: LogEntry[]) => void)[] = []

  static subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  static notifyListeners() {
    this.listeners.forEach(listener => listener([...this.logs]))
  }

  static log(level: LogEntry['level'], message: string, data?: LogEntry['data']) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      data
    }

    // Add to internal log store
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift() // Remove oldest logs
    }

    // Always log to console (development and production)
    const prefix = `[${level}] ${entry.timestamp.toLocaleTimeString()}:`
    switch (level) {
      case 'ERROR':
        console.error(prefix, message, data || '')
        break
      case 'WARN':
        console.warn(prefix, message, data || '')
        break
      case 'DEBUG':
        console.debug(prefix, message, data || '')
        break
      default:
        console.log(prefix, message, data || '')
    }

    this.notifyListeners()
    return entry
  }

  static info(message: string, data?: LogEntry['data']) {
    return this.log('INFO', message, data)
  }

  static debug(message: string, data?: LogEntry['data']) {
    // Debug logging disabled for production use
    return null
  }

  static warn(message: string, data?: LogEntry['data']) {
    return this.log('WARN', message, data)
  }

  static error(message: string, data?: LogEntry['data']) {
    return this.log('ERROR', message, data)
  }

  static getLogs(): LogEntry[] {
    return [...this.logs]
  }

  static clearLogs() {
    this.logs = []
    this.notifyListeners()
  }

  static getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }
}

export function ConsoleLogs({ model, messages, status, webSearch, isVisible }: ConsoleLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const logsEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  useEffect(() => {
    // Subscribe to log updates
    const unsubscribe = Logger.subscribe(setLogs)

    // Always enable logging - it's for production monitoring
    Logger.info('Application session started')
    Logger.debug('Model configuration', { model })
    Logger.info('Web search capability', { enabled: webSearch })

    // Log all essential chat events
    Logger.info('Chat session initialized', {
      initialMessageCount: messages.length,
      currentStatus: status
    })

    // Log current conversation state
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      Logger.info('Conversation loaded', {
        totalMessages: messages.length,
        lastMessageRole: lastMessage?.role,
        hasAttachments: messages.some(msg => msg.parts.some(part => part.type !== 'text'))
      })
    }

    return unsubscribe
  }, [model, webSearch, messages, status])



  // Log status changes
  useEffect(() => {
    Logger.info('Chat status changed', { status })
  }, [status])

  // Log message additions
  useEffect(() => {
    const latestMessage = messages[messages.length - 1]
    if (latestMessage) {
      const textContent = latestMessage.parts.find(p => p.type === 'text')?.text
      Logger.info('New message added', {
        role: latestMessage.role,
        hasText: Boolean(textContent),
        textLength: textContent?.length || 0,
        hasAttachments: latestMessage.parts.some(p => p.type !== 'text'),
        totalMessages: messages.length
      })
    }
  }, [messages.length])

  if (!isVisible) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3>Console Logs</h3>
        <ConsoleClear />
      </div>

      <div className="flex-1 overflow-auto">
        <div>
          {logs.length === 0 ? (
            <div>No logs available</div>
          ) : (
            logs.map((log) => (
              <div key={log.id}>
                <span>
                  [{log.level}] {log.timestamp.toLocaleTimeString()}:
                </span>{' '}
                <span>{log.message}</span>
                {log.data && (
                  <span>
                    {typeof log.data === 'object' ? JSON.stringify(log.data, null, 0) : String(log.data)}
                  </span>
                )}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  )
}

// Export logger for use in other components
export { Logger }
