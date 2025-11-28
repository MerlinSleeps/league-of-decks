import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Impressum | Runic Library',
    description: 'Legal Notice and Operator Information for Runic Library',
};

export default function ImpressumPage() {
    return (
        <main className="container mx-auto px-4 py-10 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8 text-white border-b border-gray-800 pb-4">
                Impressum <span className="text-lg text-gray-400 font-normal">(Legal Notice)</span>
            </h1>

            <div className="space-y-8 text-gray-300">

                {/* SECTION 1: Operator Information */}
                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Angaben gemäß § 5 TMG / Operator Information</h2>
                    <p className="text-sm text-gray-400 italic mb-4">
                        (Information according to German Telemedia Act)
                    </p>

                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                        <p className="font-bold text-white mb-2">[Your Full Name]</p>
                        <p>[Street Address] (Required for full compliance)</p>
                        <p>[Postal Code] [City]</p>
                        <p>[Country]</p>
                    </div>
                </section>

                {/* SECTION 2: Contact */}
                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Contact</h2>
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 space-y-2">
                        <p>
                            <span className="text-gray-500 w-24 inline-block">Email:</span>
                            <a href="mailto:stuckinstonemedia@gmail.com" className="text-cyan-400 hover:underline">
                                stuckinstonemedia@gmail.com
                            </a>
                        </p>
                        {/* Optional: Add phone number if you have a business line */}
                        {/* <p><span className="text-gray-500 w-24 inline-block">Phone:</span> +49 ...</p> */}
                    </div>
                </section>

                {/* SECTION 3: Content Liability */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Liability for Content</h2>
                    <p>
                        As a service provider, we are responsible for our own content on these pages in accordance with general laws.
                        However, we are not obligated to monitor transmitted or stored third-party information or to investigate
                        circumstances that indicate illegal activity.
                    </p>
                </section>

                {/* SECTION 4: Riot Games Legal Jibber Jabber (Mandatory) */}
                <section className="space-y-4 pt-6 border-t border-gray-800">
                    <h2 className="text-xl font-semibold text-white">Riot Games Disclaimer</h2>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-sm leading-relaxed text-gray-400">
                        <p>
                            Runic Library isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games
                            or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all
                            associated properties are trademarks or registered trademarks of Riot Games, Inc.
                        </p>
                    </div>
                </section>

                {/* SECTION 5: Online Dispute Resolution (Standard for EU) */}
                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">EU Dispute Resolution</h2>
                    <p>
                        The European Commission provides a platform for online dispute resolution (ODR):{' '}
                        <a
                            href="https://ec.europa.eu/consumers/odr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline"
                        >
                            https://ec.europa.eu/consumers/odr/
                        </a>
                        .<br />
                        We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                    </p>
                </section>

            </div>
        </main>
    );
}