'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { notices } from '@/app/lib/notice';
import { Notice } from '@/app/lib/types';
import ShareDialog from './ShareDialog'; 
import NoticeCard from '@/components/ui/NoticeCard';


export default function NoticeBoardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set<string>());
  const [shareNotice, setShareNotice] = useState<Notice | null>(null);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) =>
      [notice.title, notice.description, notice.entity, notice.publisher]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleExpand = (noticeId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      newSet.has(noticeId) ? newSet.delete(noticeId) : newSet.add(noticeId);
      return newSet;
    });
  };

  const handleShare = (notice: Notice) => {
    setShareNotice(notice);
  };

  const handleCopy = async (notice: Notice) => {
    const text = `${notice.title}\n\n${notice.description}\n\nPublisher: ${notice.publisher}\nTime: ${new Date(
      notice.eventTime
    ).toLocaleString()}\nLocation: ${notice.location}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Notice copied to clipboard!');
    } catch (err) {
      alert('Failed to copy notice. Please try manually.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Campus Notices</h1>
          <p className="text-gray-600 text-base">
            Stay updated with the latest announcements and events
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notices by title, content, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border border-indigo-200 focus:ring-2 focus:ring-indigo-400 shadow focus:shadow-lg text-gray-800 placeholder-gray-500 transition-all"
          />
        </div>

        {searchTerm && (
          <p className="text-sm text-gray-500 mb-4">
            {filteredNotices.length} result{filteredNotices.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Notice List */}
        <div className="space-y-6">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                isExpanded={expandedCards.has(notice.id)}
                onToggleExpand={() => toggleExpand(notice.id)}
                onShare={handleShare}
                onCopy={handleCopy}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Search className="mx-auto h-10 w-10 opacity-40 mb-2" />
              <p>No notices found. Try adjusting your search terms.</p>
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-sm text-gray-400">
          {`>>| Total ${notices.length} notices |<<`}
        </div>
      </div>

      {/* Share Dialog */}
      {shareNotice && (
        <ShareDialog
          url={`${window.location.origin}/noticeboard#${shareNotice.id}`}
          title={shareNotice.title}
          onClose={() => setShareNotice(null)}
        />
      )}
    </div>
  );
}
