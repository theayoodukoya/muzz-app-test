type ButtonProps = {
    onClick?: (...args: any[]) => void;
    children: string;
    buttonType?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
    ariaLabel?: string;
    ariaDescribedBy?: string;
};
declare const Button: ({ onClick, children, buttonType, disabled, ariaLabel, ariaDescribedBy, }: ButtonProps) => import("react").JSX.Element;
export default Button;
