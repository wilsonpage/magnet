package org.mozilla.magnet.database;

import java.util.Date;

interface HistoryStore {
    public void insert(String url);
    public void updateLastSeen(int id);
    public HistoryRecord getSince(String url, Date since);
}
