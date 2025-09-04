import { useState } from 'react';
import type { Tag } from './types/Tag';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import NotesList from './components/NotesList';
import LoginPage from './components/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider, useNotes } from './context/NotesContext';
import { useAuth } from './hooks/useAuth';
import { MdLogout } from 'react-icons/md';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const { notes, setNotes } = useNotes();
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const toggleExpand = (id: number) => {
    setNotes(notes =>
      notes.map(note =>
        note.id === id ? { ...note, expanded: !note.expanded } : note
      )
    );
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show main app if authenticated
  return (
    <div className="w-full min-w-0">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-4 md:mt-10 px-4 flex flex-col">
        <SearchBar 
          search={search} 
          setSearch={setSearch}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <NotesList 
          notes={notes} 
          search={search} 
          selectedTags={selectedTags}
          toggleExpand={toggleExpand} 
        />
        <div className="flex justify-center mt-8 mb-8">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-3 border border-black rounded hover:bg-gray-100 transition-colors text-sm md:text-base"
            style={{ backgroundColor: '#DDDCC8', color: 'black' }}
            title="Logout"
          >
            <MdLogout size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;
