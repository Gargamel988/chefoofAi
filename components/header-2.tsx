'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/menu-toggle-icon';
import { useScroll } from '@/components/use-scroll';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Compass,
	CalendarDays,
	Bookmark,
	User,
	LogOut,
	PlusCircle,
	ChevronDown,
	LayoutDashboard,
	Sparkles
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Profile } from '@/services/profiles';
import Image from 'next/image';

interface HeaderProps {
	profile?: Profile | null;
}

export function Header({ profile }: HeaderProps) {
	const [open, setOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const scrolled = useScroll(10);
	const pathname = usePathname();
	const router = useRouter();
	const userMenuRef = useRef<HTMLDivElement>(null);
	const supabase = createClient();

	const links = [
		{ label: 'Keşfet', href: '/discover', icon: Compass },
		{ label: 'Ne Pişirsem?', href: '/whatever-cook', icon: Sparkles },
		{ label: 'Planla', href: '/weekly-plan-ai', icon: CalendarDays },
		{ label: 'Favoriler', href: '/favorites', icon: Bookmark },
	];

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUserMenuOpen(false);
		router.refresh();
	};

	useEffect(() => {
		if (open) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
		return () => { document.body.style.overflow = ''; };
	}, [open]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setUserMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const UserSection = () => {
		if (profile) {
			return (
				<div className="flex items-center gap-3 relative" ref={userMenuRef}>
					<Link href="/pricing" className="hidden lg:block">
						<Button variant="ghost" size="sm" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 gap-2 h-9 rounded-xl font-bold border border-orange-500/20">
							<Sparkles className="w-4 h-4 fill-orange-500" />
							<span>Premium'a Geç</span>
						</Button>
					</Link>

					<Link href="/publish" className="hidden sm:block">
						<Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 gap-2 h-9 rounded-xl font-bold">
							<PlusCircle className="w-4 h-4" />
							<span>Tarif Paylaş</span>
						</Button>
					</Link>

					<button
						onClick={() => setUserMenuOpen(!userMenuOpen)}
						className="flex items-center gap-2 p-0.5 pr-2 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all outline-none"
					>
						<Avatar className="w-8 h-8 rounded-xl border border-white/10">
							<AvatarImage src={profile.avatar_url || ""} />
							<AvatarFallback className="bg-orange-500/10 text-orange-500 font-bold text-xs">
								{profile.name?.toUpperCase()?.[0] || 'U'}
							</AvatarFallback>
						</Avatar>
						<ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 transition-transform", userMenuOpen && "rotate-180")} />
					</button>

					<AnimatePresence>
						{userMenuOpen && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 10 }}
								className="absolute right-0 top-full mt-3 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-[60] backdrop-blur-3xl"
							>
								<div className="px-3 py-2.5 mb-2 border-b border-white/5">
									<div className="flex items-center justify-between mb-1">
										<p className="text-sm font-bold text-white leading-none">{profile.name}</p>
										<span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-500 font-black tracking-wider uppercase">{profile.subscription_tier || 'Free'}</span>
									</div>
									<p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest leading-none">Kullanıcı Paneli</p>
								</div>
								<div className="space-y-1">
									{profile.subscription_tier !== 'Premium' && (
										<Link href="/pricing" onClick={() => setUserMenuOpen(false)} className="block mb-2">
											<div className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white bg-linear-to-br from-orange-600 to-amber-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all">
												<Sparkles className="w-4 h-4 fill-white" /> Planımı Yükselt
											</div>
										</Link>
									)}
									<Link href="/profile" onClick={() => setUserMenuOpen(false)}>
										<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
											<User className="w-4 h-4" /> Profil Ayarları
										</div>
									</Link>
									<Link href="/weekly-plan" onClick={() => setUserMenuOpen(false)}>
										<div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
											<CalendarDays className="w-4 h-4" /> Yemek Planlarım
										</div>
									</Link>
								</div>
								<div className="h-px bg-white/5 my-2 mx-2" />
								<button
									onClick={handleSignOut}
									className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
								>
									<LogOut className="w-4 h-4" /> Çıkış Yap
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			);
		}

		return (
			<div className="flex items-center gap-2">
				<Link href="/auth">
					<Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white rounded-xl">Giriş Yap</Button>
				</Link>
				<Link href="/auth">
					<Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-5 h-9 font-bold shadow-lg shadow-orange-600/20">Katıl</Button>
				</Link>
			</div>
		);
	};

	return (
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-6xl md:transition-all md:ease-out px-4',
				{
					'md:top-4': scrolled && !open,
				},
			)}
		>
			<nav
				className={cn(
					'flex h-16 w-full items-center justify-between px-4 rounded-[1.75rem] border border-transparent transition-all duration-300',
					{
						'bg-black/60 border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]': scrolled || open,
						'bg-transparent': !scrolled && !open,
					}
				)}
			>
				<Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
					<Image src="/logo.webp" alt="Logo" width={40} height={40} priority />
					<span className="font-black text-xl tracking-tight text-white hidden sm:block">Cheefood<span className="text-orange-500">AI</span></span>
				</Link>

				<div className="hidden items-center gap-1 md:flex">
					{links.map((link, i) => {
						const Icon = link.icon;
						const isActive = pathname === link.href;
						return (
							<Link
								key={i}
								href={link.href}
								className={cn(
									"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
									isActive
										? "text-orange-500 bg-orange-500/10"
										: "text-zinc-400 hover:text-white hover:bg-white/5"
								)}
							>
								<Icon className="w-4 h-4" />
								{link.label}
							</Link>
						);
					})}
				</div>

				<div className="flex items-center gap-3">
					<UserSection />
					<Button size="icon" variant="ghost" onClick={() => setOpen(!open)} className="md:hidden text-white hover:bg-white/5 rounded-xl h-10 w-10">
						<MenuToggleIcon open={open} className="size-5" duration={300} />
					</Button>
				</div>
			</nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xl md:hidden flex flex-col pt-24"
					>
						<div className="flex h-full w-full flex-col gap-8 p-8 relative z-50">
							<div className="flex flex-col gap-2">
								<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-4 mb-2">Navigasyon</p>
								{links.map((link) => {
									const Icon = link.icon;
									const isActive = pathname === link.href;
									return (
										<Link
											key={link.label}
											href={link.href}
											onClick={() => setOpen(false)}
											className={cn(
												"flex items-center gap-4 px-4 py-4 rounded-2xl text-xl font-black transition-all",
												isActive
													? "text-orange-500 bg-orange-500/10"
													: "text-zinc-300 active:bg-white/5"
											)}
										>
											<div className={cn(
												"w-12 h-12 rounded-xl flex items-center justify-center",
												isActive ? "bg-orange-500/20" : "bg-zinc-800"
											)}>
												<Icon className="w-6 h-6" />
											</div>
											{link.label}
										</Link>
									);
								})}
							</div>

							{!profile && (
								<div className="mt-auto flex flex-col gap-3 pb-8">
									<Link href="/auth/signup" onClick={() => setOpen(false)}>
										<Button className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-bold shadow-lg shadow-orange-600/20">Kaydol</Button>
									</Link>
									<Link href="/auth/login" onClick={() => setOpen(false)}>
										<Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-lg font-bold">Giriş Yap</Button>
									</Link>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
