import React from "react";

export default function AboutPage() {
  return (
    <div className="w-full h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-center text-card-foreground mb-12">
        Meist
      </h1>
      <div className="flex justify-center space-x-6">
        {/* Cube 1 */}
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-xs transform rotate-2 hover:rotate-0 transition-transform duration-300">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Meie missioon
          </h2>
          <p className="text-muted-foreground">
            Meie "Raamatuklubi" eesmärk on taaselustada raamatute lugemise
            kultuur. Uskume, et raamatud inspireerivad, harivad ja loovad
            sügavaid emotsionaalseid sidemeid. Meie missioon on tuua inimesed
            taas lähemale lugemisele.
          </p>
        </div>

        {/* Cube 2 */}
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-xs transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Probleem, mida soovime lahendada
          </h2>
          <p className="text-muted-foreground">
            Tehnoloogia ja kiire elutempo tõttu on paljud inimesed kaotanud huvi
            lugemise vastu. Tahame aidata inimestel avastada uuesti raamatute
            ilu ja kasu.
          </p>
        </div>

        {/* Cube 3 */}
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-xs transform rotate-6 hover:rotate-0 transition-transform duration-300">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Kuidas me seda teeme
          </h2>
          <p className="text-muted-foreground">
            Korraldame regulaarselt kohtumisi, jagame raamatusoovitusi ja loome
            kogukonna, kus igaüks tunneb end motiveerituna lugema rohkem ja
            avastama uusi maailmu raamatute kaudu.
          </p>
        </div>
      </div>
    </div>
  );
}
