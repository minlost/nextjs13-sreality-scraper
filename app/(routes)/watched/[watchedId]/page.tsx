import { db } from "@/utils/client/prismaDb"
import WatchedDetail from "./components/WatchedDetail"

interface WatchedDetailPageProps {
  params: {
    watchedId: string
  }
}

const WatchedDetailPage = async ({ params }: WatchedDetailPageProps) => {
  const watchedDedatilData = await db.scrapeResultValueWatched.findFirst({
    where: { id: params.watchedId },
    include: {
      priceList: true,
    },
  })

  return (
    <div className="flex flex-col items-center ">
      <WatchedDetail data={watchedDedatilData} />{" "}
    </div>
  )
}

export default WatchedDetailPage
