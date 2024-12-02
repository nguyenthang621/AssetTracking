import ImageUploading, { ImageListType } from 'react-images-uploading'

interface props {
  handleUploadAll: () => void
  images: ImageListType
  onChange: (imageList: ImageListType, addUpdateIndex: number[] | undefined) => void
  uploading: boolean
}

export function CardUploadImages({ handleUploadAll, images, onChange, uploading }: props) {
  const maxNumber = 60

  return (
    <div className='App mt-2 w-full'>
      <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber} dataURLKey='data_url'>
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
          <div className='upload__image-wrapper'>
            {!(imageList.length > 0) ? (
              <div className='mb-4 w-full'>
                <div
                  style={isDragging ? { color: 'red' } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                  className='w-full'
                >
                  <div className='flex w-full items-center justify-center'>
                    <label className='flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:bg-gray-800'>
                      <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                        <svg
                          className='mb-4 h-8 w-8 text-gray-500 dark:text-gray-400'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 20 16'
                        >
                          <path
                            stroke='currentColor'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                          />
                        </svg>
                        <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                          <span className='font-semibold'>Click to upload</span> or drag and drop
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={onImageRemoveAll}
                  className='ml-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700'
                >
                  Remove all images
                </button>
                <button
                  onClick={handleUploadAll}
                  className='ml-2 hidden rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload all images'}
                </button>
              </div>
            )}

            {imageList.length > 0 && (
              <div className='flex w-full space-x-4 overflow-hidden overflow-x-auto rounded border-2 border-gray-200 p-4'>
                {imageList.map((image, index) => (
                  <div key={index} className='image-item flex w-1/3 max-w-xs flex-shrink-0 flex-col items-center'>
                    <img src={image['data_url']} alt='' className='h-32 w-full rounded-md object-cover shadow-md' />
                    <div className='mt-2'>
                      <button
                        onClick={() => onImageRemove(index)}
                        className='rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  )
}
