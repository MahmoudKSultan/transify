use crate::domain::models::HistoryEntry;
use std::collections::VecDeque;

pub struct HistoryStore {
    entries: VecDeque<HistoryEntry>,
    max_entries: usize,
}

impl HistoryStore {
    pub fn new(max_entries: usize) -> Self {
        Self {
            entries: VecDeque::with_capacity(max_entries),
            max_entries,
        }
    }

    pub fn push(&mut self, entry: HistoryEntry) {
        if self.entries.len() >= self.max_entries {
            self.entries.pop_back();
        }
        self.entries.push_front(entry);
    }

    pub fn get_all(&self) -> Vec<HistoryEntry> {
        self.entries.iter().cloned().collect()
    }

    pub fn clear(&mut self) {
        self.entries.clear();
    }
}
