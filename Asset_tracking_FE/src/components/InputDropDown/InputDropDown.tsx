import { useRef } from 'react'
import Select from 'react-select'

export interface OptionType {
  value: string
  label: string
}

interface Props {
  setSelect: any
  options: OptionType[]
  checkDisable?: boolean
  currenValue: any
  isMulti: boolean
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: '6px',
    border: '1px solid #d9d9d9',
    padding: '0 px',
    width: '100% !important'
    // boxShadow: '1px 1px 1px rgb(203 213 225)'
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#333' // Màu chữ
  })
}

function InputDropdown({ options, setSelect, checkDisable, currenValue, isMulti }: Props) {
  const selectInputRef = useRef<any>(null)
  const onClear = () => {
    if (selectInputRef.current) {
      selectInputRef.current.clearValue()
    }
  }

  return (
    <div className='relative w-full'>
      <Select
        placeholder={'Search to select'}
        ref={selectInputRef}
        onChange={(e) => {
          console.log('>>>>>.', e)
          setSelect(e)
        }}
        options={options}
        styles={customStyles}
        // isDisabled={checkDisable}
        closeMenuOnSelect={!isMulti}
        isMulti={isMulti}
        isClearable={false}
        //   value={selectedClinic}
      />
      {currenValue && (
        <div className='absolute right-0 top-[3px] mr-1 cursor-pointer rounded bg-white p-2' onClick={onClear}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-4 w-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </div>
      )}
    </div>
  )
}

export default InputDropdown
