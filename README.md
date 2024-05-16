# MoviePicker

## Lyhyt kuvaus käytetyistä teknologioista

MoviePicker-sovellus on rakennettu hyödyntäen useita moderneja web- ja mobiilikehitysteknologioita. Alla on lyhyt kuvaus käytetyistä teknologioista:

- **React Native**: Sovellus on rakennettu React Native -kehystä käyttäen, joka mahdollistaa natiivien mobiilisovellusten kehittämisen JavaScriptillä ja Reactilla.
- **Firebase**: Firebase tarjoaa useita pilvipohjaisia palveluita, joita sovellus käyttää:
  - **Firebase Authentication**: Käytetään käyttäjien kirjautumiseen ja rekisteröintiin.
  - **Firebase Firestore**: NoSQL-tietokanta, joka tallentaa käyttäjien toivelistan ja arvostelut.
- **Expo**: Expo on kehitysympäristö, joka helpottaa React Native -sovellusten rakentamista ja testaamista.
- **The Movie Database (TMDb) API**: Sovellus käyttää TMDb API:a elokuvien tietojen hakemiseen ja näyttämiseen.

## Lyhyt kuvaus projektin toiminnoista

MoviePicker-sovellus tarjoaa seuraavat toiminnot:

1. **Käyttäjätilin hallinta**:
   - Käyttäjät voivat rekisteröityä ja kirjautua sisään sähköpostilla ja salasanalla.
   - Käyttäjät voivat kirjautua ulos sovelluksesta.

2. **Etusivu**:
   - Etusivulla käyttäjät voivat nähdä satunnaisen valinnan elokuvista (Spinning Wheel -komponentti).

3. **Toivelista**:
   - Käyttäjät voivat hakea elokuvia TMDb API:n avulla ja lisätä niitä toivelistalleen.
   - Käyttäjät voivat poistaa elokuvia toivelistaltaan.
   - Toivelistan elokuvia voidaan tarkastella ja niiden tietoja voidaan katsoa tarkemmin.

4. **Arvostelut**:
   - Käyttäjät voivat hakea elokuvia ja antaa niille arvosanoja.
   - Käyttäjät voivat muokata ja poistaa antamiaan arvosanoja.
   - Käyttäjät voivat tarkastella arvostelemiensa elokuvien tietoja.

5. **Elokuvan tiedot**:
   - Käyttäjät voivat tarkastella yksityiskohtaisia tietoja valitusta elokuvasta, kuten julkaisupäivää, kuvausta ja julistekuvaa.

## Projektin tiedostorakenne

- `App.js`: Sovelluksen pääkomponentti, joka määrittää navigoinnin ja käyttäjän autentikoinnin tilan.
- `FirebaseConfig.js`: Firebase-konfiguraatio ja -initalisoinnit.
- `metro.config.js`: Expo Metro -konfiguraatio.
- `screens/Home.js`: Etusivun komponentti.
- `screens/Login.js`: Kirjautumis- ja rekisteröitymiskomponentti.
- `screens/MovieDetails.js`: Elokuvan yksityiskohtien näyttökomponentti.
- `screens/Ratings.js`: Elokuvien arvostelukomponentti.
- `screens/Wishlist.js`: Toivelistakomponentti.

