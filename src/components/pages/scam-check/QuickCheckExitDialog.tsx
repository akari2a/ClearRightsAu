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
