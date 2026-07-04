import React from 'react';

export default function ContactSection() {
    return (
        <section id="contact" className="relative w-full py-24 bg-[#050505] overflow-hidden z-30">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,0.6)_0%,rgba(5,5,5,1)_100%)] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Get in <span className="gold-gradient">Touch</span>
                    </h2>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto mb-6"></div>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        We would love to hear from you. Contact us for orders, partnerships, or inquiries.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Contact Form */}
                    <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-xl shadow-2xl shrink-0">
                        <form className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <input type="text" placeholder="Full Name" required 
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 rounded-lg px-5 py-4 focus:outline-none focus:border-zinc-500 focus:bg-white/10 transition-all font-light" />
                                </div>
                                <div>
                                    <input type="email" placeholder="Email Address" required 
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 rounded-lg px-5 py-4 focus:outline-none focus:border-zinc-500 focus:bg-white/10 transition-all font-light" />
                                </div>
                                <div>
                                    <input type="tel" placeholder="Phone Number" 
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 rounded-lg px-5 py-4 focus:outline-none focus:border-zinc-500 focus:bg-white/10 transition-all font-light" />
                                </div>
                                <div>
                                    <input type="text" placeholder="Subject" required 
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 rounded-lg px-5 py-4 focus:outline-none focus:border-zinc-500 focus:bg-white/10 transition-all font-light" />
                                </div>
                                <div>
                                    <textarea placeholder="Message" rows={5} required 
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 rounded-lg px-5 py-4 focus:outline-none focus:border-zinc-500 focus:bg-white/10 transition-all font-light resize-none"></textarea>
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full glass-button relative overflow-hidden group bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-light tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white/10 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                <span className="relative z-10">Send Message</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col justify-between glass-card p-8 md:p-10 rounded-2xl border border-white/10 bg-[#0D0D0D]/80 backdrop-blur-xl shadow-2xl h-full">
                        <div className="space-y-10">
                            <div>
                                <h4 className="text-white text-xl font-medium tracking-wide mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Headquarters</h4>
                                <p className="text-zinc-400 font-light leading-relaxed">
                                    Domicilié à BONDOUKOU quartier CENTRE-VILLE KAMAGAYA<br />
                                    (lot N°10A ILOT N°911)<br />
                                    N° CNI CI 000967511 établie le 08/12/2020 à ABIDJAN
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-white text-xl font-medium tracking-wide mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Contact Details</h4>
                                <p className="text-zinc-400 font-light leading-relaxed">
                                    WhatsApp: +233596308908<br />
                                    Local Number: +2250700816114
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 flex">
                            <a 
                                href="https://wa.me/233596308908" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full text-center text-xs uppercase tracking-[0.2em] text-zinc-300 border border-white/10 px-6 py-4 rounded-full hover:bg-white hover:text-[#050505] hover:border-white font-semibold transition-all duration-300"
                            >
                                Contact
                            </a>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl glass-card bg-[#0D0D0D]/80 p-2">
                    <iframe 
                        className="w-full h-full rounded-xl"
                        style={{ filter: "invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)" }}
                        src="https://maps.google.com/maps?q=8°02'30.3%22N+2°47'47.5%22W&hl=en&z=14&output=embed" 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </section>
    );
}
