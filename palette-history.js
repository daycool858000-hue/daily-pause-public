// In-memory undo/redo only. No content leaves the browser or persists to localStorage.
(() => {
  function createPaletteHistory({ read, write, onChange = () => {}, limit = 20 }) {
    if (typeof read !== 'function' || typeof write !== 'function') throw new TypeError('History requires read and write');
    const max = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 20;
    const undoStack = [];
    const redoStack = [];
    const clone = state => JSON.parse(JSON.stringify(state));
    const notify = () => onChange({ canUndo: undoStack.length > 0, canRedo: redoStack.length > 0 });
    const record = () => {
      undoStack.push(clone(read()));
      if (undoStack.length > max) undoStack.shift();
      redoStack.length = 0;
      notify();
    };
    const undo = () => {
      if (!undoStack.length) return false;
      redoStack.push(clone(read()));
      write(undoStack.pop());
      notify();
      return true;
    };
    const redo = () => {
      if (!redoStack.length) return false;
      undoStack.push(clone(read()));
      write(redoStack.pop());
      notify();
      return true;
    };
    notify();
    return { record, undo, redo, canUndo: () => undoStack.length > 0, canRedo: () => redoStack.length > 0 };
  }
  window.createPaletteHistory = createPaletteHistory;
})();
