"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  text: string;
  dateRange?: { start: Date; end: Date } | null;
  createdAt: Date;
  color: string;
}

interface NotesSectionProps {
  selectedRange: { start: Date | null; end: Date | null };
  currentDate: Date;
}

const NOTE_COLORS = [
  "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
  "bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800",
  "bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800",
  "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
];

export function NotesSection({ selectedRange, currentDate }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [attachToRange, setAttachToRange] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("calendar-notes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(
          parsed.map((note: Note) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            dateRange: note.dateRange
              ? {
                  start: new Date(note.dateRange.start),
                  end: new Date(note.dateRange.end),
                }
              : null,
          }))
        );
      } catch {
        setNotes([]);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("calendar-notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      dateRange: attachToRange && selectedRange.start && selectedRange.end
        ? { start: selectedRange.start, end: selectedRange.end }
        : null,
      createdAt: new Date(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    };

    setNotes((prev) => [note, ...prev]);
    setNewNote("");
    setAttachToRange(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const formatDateRange = (range: { start: Date; end: Date }) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${range.start.toLocaleDateString("en-US", options)} - ${range.end.toLocaleDateString("en-US", options)}`;
  };

  // Filter notes for current month
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const filteredNotes = notes.filter((note) => {
    if (note.dateRange) {
      const noteMonth = note.dateRange.start.getMonth();
      const noteYear = note.dateRange.start.getFullYear();
      return noteMonth === currentMonth && noteYear === currentYear;
    }
    // Show general notes (no date range) always
    return true;
  });

  const rangeNotes = filteredNotes.filter((note) => note.dateRange);
  const generalNotes = filteredNotes.filter((note) => !note.dateRange);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <StickyNote className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Notes</h3>
      </div>

      {/* Add note form */}
      <div className="mb-6">
        <div className="relative">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className={cn(
              "w-full min-h-[80px] p-3 rounded-lg border border-input bg-background text-foreground",
              "placeholder:text-muted-foreground resize-none",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-all duration-200"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                handleAddNote();
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-3 gap-2">
          {selectedRange.start && selectedRange.end && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={attachToRange}
                onChange={(e) => setAttachToRange(e.target.checked)}
                className="rounded border-input"
              />
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">
                Attach to {selectedRange.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {selectedRange.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </label>
          )}
          {!selectedRange.start || !selectedRange.end && (
            <span className="text-xs text-muted-foreground">
              Select a date range to attach notes
            </span>
          )}
          <Button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            size="sm"
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Range-attached notes */}
        {rangeNotes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Scheduled Notes
            </p>
            <div className="space-y-2">
              {rangeNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200",
                    "hover:shadow-sm group",
                    note.color
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                        {note.text}
                      </p>
                      {note.dateRange && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateRange(note.dateRange)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General notes */}
        {generalNotes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              General Notes
            </p>
            <div className="space-y-2">
              {generalNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200",
                    "hover:shadow-sm group",
                    note.color
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words flex-1 min-w-0">
                      {note.text}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <StickyNote className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No notes yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Add a note above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
