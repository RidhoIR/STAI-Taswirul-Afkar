import { ImgHTMLAttributes } from 'react';
import logo from "../../../public/images/logo stai.png"

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src={logo} alt="Application Logo" />
    );
}
