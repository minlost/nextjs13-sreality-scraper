export default async function HomePage() {
  return (
    <>
      <main className="flex justify-center">
        <p className="md:max-w-lg font-semibold italic text-neutral-500">
          Vítejte v scrapovací aplikaci pro SREALITY. I když je tento projekt
          plně funkční, je určen primárně jako studijní projekt, nikoli pro
          produkční využití. Timeout scrapování je z etických důvodů nastaven na
          5 sekund, aby nedocházelo k přetížení serverů SREALITY.
          <span className="text-neutral-600 font-bold">
            K zpřístupění všech funkcí je potřeba se přihlásit.
          </span>
        </p>
      </main>
    </>
  )
}
