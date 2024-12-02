import React, { Component } from 'react'

interface SearchInputProps {
  delay?: number
  placeholder?: string
  type: string
  className?: string
  initColor?: string
  handleSearch: (keyword: string) => void
  [key: string]: any // This allows any additional props (rest props)
}

interface SearchInputState {
  keyword: string
}

export class SearchInput extends Component<SearchInputProps, SearchInputState> {
  private timer: NodeJS.Timeout | null = null

  constructor(props: SearchInputProps) {
    super(props)
    this.state = {
      keyword: props.initColor || '#FF0000'
    }
  }

  componentDidUpdate(prevProps: SearchInputProps) {
    // Check if initColor prop has changed
    if (prevProps.initColor !== this.props.initColor) {
      this.setState({
        keyword: this.props.initColor || '#FF0000'
      })
    }
  }

  handleOnChangeInput = (input: string) => {
    const { delay = 100 } = this.props

    this.setState({
      keyword: input
    })

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      this.props.handleSearch(input)
    }, delay)
  }

  componentWillUnmount() {
    // Clear timeout when the component is unmounted to prevent memory leaks
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  render() {
    const { placeholder = 'Tìm kiếm...', type, className, value, ...rest } = this.props // Extract rest props
    const { keyword } = this.state

    return (
      <div className='search-input'>
        <div className='wrapper-search'>
          <input
            type={type}
            className={(className || '') + ' input'}
            value={keyword}
            onChange={(e) => this.handleOnChangeInput(e.target.value)}
            {...rest}
          />
        </div>
      </div>
    )
  }
}
