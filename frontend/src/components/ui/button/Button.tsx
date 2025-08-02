type ButtonProps = {
  onClick?: (...args: any[]) => void;
  children: string;
  buttonType?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
};

const Button = ({
  onClick,
  children,
  buttonType = 'button',
  disabled,
  ariaLabel,
  ariaDescribedBy,
}: ButtonProps) => {
  return (
    <button
      type={buttonType}
      className={`border-0 rounded-lg bg-[#e8506e] text-white px-2.5 py-1.5 font-semibold cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#cc3d59] focus:outline-none focus:ring-2 focus:ring-[#e8506e] focus:ring-offset-2 ${
        disabled ? 'opacity-50 cursor-not-allowed hover:bg-[#e8506e]' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || children}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </button>
  );
};

export default Button;
