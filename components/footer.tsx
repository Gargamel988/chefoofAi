import {
    Mail,
    Facebook,
    Instagram,
    Twitter,
    Globe,
} from "lucide-react";
import { FooterBackgroundGradient } from "@/components/hover-footer";
import { TextHoverEffect } from "@/components/hover-footer";

function HoverFooter() {
    // Footer link data
    const footerLinks = [
        {
            title: "Uygulama",
            links: [
                { label: "Keşfet", href: "/discover" },
                { label: "Ne Pişirsem?", href: "/whatever-cook" },
                { label: "Tarif Paylaş", href: "/publish" },
                { label: "Haftalık Plan", href: "/weekly-plan" },
            ],
        },
        {
            title: "Yasal",
            links: [
                { label: "Gizlilik Politikası", href: "#" },
                { label: "Kullanım Şartları", href: "#" },
            ],
        },
    ];

    // Contact info data
    const contactInfo = [
        {
            icon: <Mail size={18} className="text-orange-500" />,
            text: "omeraydin1.web@gmail.com",
            href: "mailto:omeraydin1.web@gmail.com",
        },
        {
            icon: <Globe size={18} className="text-orange-500" />,
            text: "hatayyazilim.com",
            href: "https://hatayyazilim.com",
        },

    ];

    // Social media icons
    const socialLinks = [
        { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
        { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
        { icon: <Twitter size={20} />, label: "Twitter", href: "https://x.com/Hatayyazilim" },
    ];

    return (
        <footer className="bg-[#0F0F11]/10 relative h-fit rounded-3xl overflow-hidden m-8">
            <div className="max-w-7xl mx-auto p-14 z-20 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
                    {/* Brand section */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-orange-500 text-3xl font-extrabold font-serif">
                                chefood
                            </span>
                            <span className="text-white text-3xl font-black tracking-tighter">AI</span>
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-400">
                            Yapay zeka asistanınla mutfakta devrim yarat. Senin için en iyi tarifleri oluşturur ve haftanı planlar.
                        </p>
                    </div>

                    {/* Footer link sections */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-white text-lg font-semibold mb-6">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label} className="relative">
                                        <a
                                            href={link.href}
                                            className="hover:text-orange-500 transition-colors"
                                        >
                                            {link.label}
                                        </a>

                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact section */}
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-6">
                            İletişim
                        </h4>
                        <ul className="space-y-4">
                            {contactInfo.map((item, i) => (
                                <li key={i} className="flex items-center space-x-3">
                                    {item.icon}
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="hover:text-orange-500 transition-colors"
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="hover:text-orange-500 transition-colors">
                                            {item.text}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <hr className="border-t border-gray-700 my-8" />

                {/* Footer bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
                    {/* Social icons */}
                    <div className="flex space-x-6 text-gray-400">
                        {socialLinks.map(({ icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="hover:text-orange-500 transition-colors z-30"
                                target="_blank"
                                title={label}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p className="text-center md:text-left text-zinc-500">
                        &copy; {new Date().getFullYear()} Hatay Yazılım. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>

            {/* Text hover effect */}
            <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36 relative z-10 pointer-events-none">
                <TextHoverEffect text="CHEEFOOD" className="z-10" />
            </div>

            <FooterBackgroundGradient />
        </footer>
    );
}

export default HoverFooter;