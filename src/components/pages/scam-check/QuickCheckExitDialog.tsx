type QuickCheckExitDialogProps = {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
};

export function QuickCheckExitDialog({ isOpen, onStay, onLeave }: QuickCheckExitDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="quick-check-dialog-backdrop" role="presentation" onClick={onStay}>
      <div
        className="quick-check-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-check-exit-title"
        aria-describedby="quick-check-exit-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="quick-check-dialog__icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h2 className="quick-check-dialog__title" id="quick-check-exit-title">
          Leave this questionnaire?
        </h2>
        <p className="quick-check-dialog__description" id="quick-check-exit-description">
          Your current answers will be lost if you leave now.
        </p>
        <div className="quick-check-dialog__actions">
          <button className="quick-check-dialog__button quick-check-dialog__button--secondary" type="button" onClick={onStay}>
            Stay here
          </button>
          <button className="quick-check-dialog__button quick-check-dialog__button--primary" type="button" onClick={onLeave}>
            Leave page
          </button>
        </div>
      </div>
    </div>
  );
}
