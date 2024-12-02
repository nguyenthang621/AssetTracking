interface CardStatsProps {
  statSubtitle: string
  statTitle: string
  statPercent: string
  statPercentColor: string
  statDescription: string
  statIcon?: React.ReactNode
  statIconColor: string
}

export default function CardStats({
  statSubtitle,
  statTitle,
  statPercent,
  statPercentColor,
  statDescription,
  statIcon,
  statIconColor
}: CardStatsProps) {
  return (
    <>
      <div className='relative mb-6 flex min-w-0 flex-col flex-nowrap break-words rounded bg-white shadow-lg xl:mb-0'>
        <div className='flex-auto p-4'>
          <div className='flex flex-nowrap'>
            <div className='relative w-full max-w-full flex-1 flex-grow pr-4'>
              <h5 className='whitespace-nowrap text-xs font-bold text-blueGray-400 md:text-xs/[8px]'>{statSubtitle}</h5>
              <span className='relative top-2 text-xl font-semibold text-blueGray-700'>{statTitle}</span>
            </div>

            <div className='relative w-auto flex-initial pl-2'>
              <div
                className={
                  'inline-flex h-8 w-8 items-center justify-center rounded-full p-3 text-center text-white shadow-lg ' +
                  statIconColor
                }
              >
                <span>{statIcon}</span>
              </div>
            </div>
          </div>
          <p className='mt-4 text-sm text-blueGray-400'>
            <span className='whitespace-nowrap md:text-sm lg:text-xs'>{statDescription}</span>
          </p>
        </div>
      </div>
    </>
  )
}
