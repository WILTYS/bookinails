import { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Image, Smile, MoreVertical, Phone, Video } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  type: 'text' | 'image' | 'file'
  timestamp: string
  read: boolean
  sender_name: string
  sender_avatar?: string
}

interface ChatProps {
  conversationId: string
  currentUserId: string
  recipientId: string
  recipientName: string
  recipientAvatar?: string
  onClose?: () => void
}

export default function Chat({ 
  conversationId, 
  currentUserId, 
  recipientId, 
  recipientName, 
  recipientAvatar,
  onClose 
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock messages pour démo
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        sender_id: recipientId,
        receiver_id: currentUserId,
        content: 'Bonjour ! J\'ai vu votre réservation pour demain à 14h. J\'ai hâte de nous rencontrer !',
        type: 'text',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        read: true,
        sender_name: recipientName,
        sender_avatar: recipientAvatar
      },
      {
        id: '2',
        sender_id: currentUserId,
        receiver_id: recipientId,
        content: 'Parfait ! J\'aimerais une manucure française. Avez-vous des vernis de couleur nude ?',
        type: 'text',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        read: true,
        sender_name: 'Vous'
      },
      {
        id: '3',
        sender_id: recipientId,
        receiver_id: currentUserId,
        content: 'Bien sûr ! J\'ai toute une gamme de vernis nude. Je vous montrerai tout ça demain 😊',
        type: 'text',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        read: false,
        sender_name: recipientName,
        sender_avatar: recipientAvatar
      }
    ]
    setMessages(mockMessages)
  }, [recipientId, recipientName, recipientAvatar, currentUserId])

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender_id: currentUserId,
      receiver_id: recipientId,
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      read: false,
      sender_name: 'Vous'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simuler une réponse automatique
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        sender_id: recipientId,
        receiver_id: currentUserId,
        content: 'Merci pour votre message ! Je vous réponds dès que possible.',
        type: 'text',
        timestamp: new Date().toISOString(),
        read: false,
        sender_name: recipientName,
        sender_avatar: recipientAvatar
      }
      setMessages(prev => [...prev, autoReply])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              {recipientAvatar ? (
                <img src={recipientAvatar} alt={recipientName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <span className="text-primary-600 font-semibold text-sm">
                  {recipientName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{recipientName}</h3>
            <p className="text-sm text-green-600">En ligne</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === currentUserId
          
          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-2 ${
                  isOwn 
                    ? 'bg-primary-500 text-white rounded-br-md' 
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className={`mt-1 text-xs text-gray-500 ${isOwn ? 'text-right' : 'text-left'}`}>
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true, locale: fr })}
                  {isOwn && (
                    <span className="ml-1">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
              
              {!isOwn && (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center ml-2 mt-auto order-2">
                  {recipientAvatar ? (
                    <img src={recipientAvatar} alt={recipientName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-primary-600 text-xs font-semibold">
                      {recipientName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
        
        {typing && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-xs font-semibold">
                {recipientName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <Image className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <Smile className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || loading}
            className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Liste des conversations
export function ConversationsList({ currentUserId, onSelectConversation }: {
  currentUserId: string
  onSelectConversation: (conversation: any) => void
}) {
  const conversations = [
    {
      id: '1',
      participant: {
        id: 'pro1',
        name: 'Sophie - Nail Paradise',
        avatar: null,
        lastSeen: 'En ligne'
      },
      lastMessage: {
        content: 'Bien sûr ! J\'ai toute une gamme de vernis nude...',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        unread: 1
      }
    },
    {
      id: '2', 
      participant: {
        id: 'pro2',
        name: 'Marie - Beauty Lounge',
        avatar: null,
        lastSeen: 'Il y a 2h'
      },
      lastMessage: {
        content: 'Parfait ! À demain alors 😊',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        unread: 0
      }
    }
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Messages</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {conversation.participant.name.charAt(0)}
                  </span>
                </div>
                {conversation.participant.lastSeen === 'En ligne' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 truncate">
                    {conversation.participant.name}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.content}
                  </p>
                  {conversation.lastMessage.unread > 0 && (
                    <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.lastMessage.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
