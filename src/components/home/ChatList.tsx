'use client';

import React from 'react';
import Link from 'next/link';
import { Users, MessageSquare, ArrowRight, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '@/lib/utils/formatters';

interface ChatItem {
  id: string;
  title: string;
  chat_type: 'group' | 'direct';
  total_messages: number;
  total_participants: number;
  first_message_date: string | null;
  last_message_date: string | null;
  created_at: string;
}

interface ChatListProps {
  chats: ChatItem[];
  onDeleteClick: (chat: ChatItem) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ chats, onDeleteClick }) => {
  if (chats.length === 0) return null;

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold font-serif text-[#0A0A0A]">
            Kayıtlı Sohbetleriniz ({chats.length}/2)
          </h3>
          <p className="text-xs text-[#6B7280]">
            Oluşturduğunuz analizler ve Yıl Özetleri
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chats.map((chat) => (
          <Card
            key={chat.id}
            className="p-5 sm:p-6 bg-white border border-[#E5E9F0] hover:border-[#38BDF8] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-bold font-serif text-[#0A0A0A] truncate max-w-[220px] sm:max-w-xs">
                    {chat.title}
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5 font-sans">
                    {formatDate(chat.first_message_date)} - {formatDate(chat.last_message_date)}
                  </p>
                </div>

                <Badge variant={chat.chat_type === 'group' ? 'blue' : 'gray'} size="sm">
                  {chat.chat_type === 'group' ? (
                    <>
                      <Users className="w-3 h-3" />
                      <span>{chat.total_participants} Kişi</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-3 h-3" />
                      <span>İkili</span>
                    </>
                  )}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#F7F9FC] rounded-2xl text-xs border border-[#E5E9F0]">
                <div>
                  <span className="text-[#6B7280] block">Toplam Mesaj</span>
                  <span className="font-bold font-mono text-[#0A0A0A] text-sm">
                    {chat.total_messages.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280] block">Oluşturulma</span>
                  <span className="font-bold font-sans text-[#0A0A0A] text-xs">
                    {formatDate(chat.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-[#E5E9F0]">
              <button
                onClick={() => onDeleteClick(chat)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-xs flex items-center gap-1"
                title="Sohbeti Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sil</span>
              </button>

              <Link href={`/chat/${chat.id}`}>
                <Button variant="primary" size="sm">
                  <span>Paneli Aç</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7DD3FC]" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
