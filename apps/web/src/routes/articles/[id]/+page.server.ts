import type { PageServerLoad } from './$types';

export const load = (async () => {
	const markdown = `

## In cornu magnorum cursu cornua desilit et

Lorem markdownum nulla, observata quod; modo ante viscera: lammina! Est summe
flectunt sternitur anticipata nata peperisse mecum fortes **et lateri nubila**.
Iam casu pigra tibi occiderat munera cornu lacerti summae ter: quasque
**neque**. Vellera ostendunt ab tamen tenet et adest: iubet humi pete!

> Precor **blandisque malas lora**, sit hoc tibi festisque coniunx pisces ne
> natarum seque incidere erat, tremulasque ambierantque. Quid removere aditus.
> [Revulsum](http://molpea.org/dixitomnes.html) et quem notas flumina: cum fac
> me frondibus sortes, simul celeberrima.

Inquit obsceno dixit, ereptus corpora. *A sed* est lapidosos ut puppis sororem
probro, ad incipit liquido. Occupat fratres condita locis Cephenum iunxit, [ego
fecit huc](http://cum.net/amata-cognoscere.aspx) mediis in nos *functus*.
Circumstant equos mergit sua exhausta et visa ad venitis tantum instrumenta
cura; Latoius?

## Non natura in

Atque supremo animata Telamon. Huic mente evellere auguris mihi erunt. Me suis
defensore, non regemque dixit, prima vocatum locis, ab **vero Echione**. In
quoque, ut Olympi deficeret, graminis manumque deserti coniuge ventis.

> Iacet potest. Sola saepe urbem relinquunt quater. Nostra inque sequentem
> tinnitibus piscator, ense nympha remittis ait petii sunt pectore dis ausis.
> Quae ille et si Nestora saligno! Non fata decem parvasque: non citra Euboicam
> vigilat in.

Dux raucos et terra pennatis divae fessas illum supplex, et populo quod laetaris
umero aut murmure. Diversa aura illa locique! Casside Romulus, dum non ita
fratres malorum **Achilles** via, *tali hastam*. Parcere sumpsisse pudore,
terras ausis dabis capillis aera, venimus dum tunc?

## Terra inpulsu mea inpono utque

Et *Idaeo quoque*. Mediis donec, in et lingua. His mater, sedet nubila una
pepulere leges. Meis cum praedaeque **venerantur deos**, aequor terres aliis, et
Graias, inmanis: illa nomen duasque! Cadentum subito suas ante [tum
ramis](http://www.oris-est.io/spissisque) relicta a inquit dixisse, in **Iovis
una par** tendebat hastile.

    if (subnetClass(thin.ribbon_service(2 + portDv, -2, unc +
            web_scrolling_page))) {
        monochrome_lan = bookmark.internetBarPoint(
                error_protector_supercomputer, bufferNewline * flash);
        sram_macro(compactSnow);
    }
    export += 2 - cisc_delete - 4;
    var ideDriveZone = 4;
    var scrolling = 26;
    if (coreSystemBloatware * web + rawGoogleCopyright - database) {
        unit_access(digital.text(samba), search_snippet_tiff, fiosPort);
        boxScarewarePrinter(systemClient, impact);
        mamp += facebook_sata + android_tablet_interpreter.hdmiSpool(appletT, 3,
                serverSerp);
    }

Hunc dumque corpora. Tela flexere: ulla nabat nec magno gaudens pondera quae
temporis. Et primos incompta stramine parvos femineos *imagine Austri et* aderas
ex sinunt potest placet? Est danda, matri adrectisque rebus dixerat patresque
frigore, nec. Tinguamus nec, fera sit distentae moenia undas, ipse pedum
nequiquam arboris prope deam.`;

	const title = 'article title';
	const authorAvatar =
		'https://images.mirror-media.xyz/publication-images/sPyyAY1axpIFmxpI-BhwB.png?height=600&width=600';
	const authorName = 'abc';
	const minterAvatars = new Array(4).fill(
		'https://images.mirror-media.xyz/publication-images/N-MMkKx65X408ZIdF99M8.png?height=592&width=592'
	) as string[];

	return {
		article: {
			title,
			author: {
				name: authorName,
				avatar: authorAvatar
			},
			content: markdown,
			minters: minterAvatars.map((a) => ({
                avatar: a,
                name: "minter name"
            }))
		}
	};
}) satisfies PageServerLoad;
