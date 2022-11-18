import { FormRow, FormRowSelect } from '.'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/SearchContainer'
import { useState, useMemo } from 'react'

const SearchContainer = () => {
  /* set up local search variable */
  const [localSearch, setLocalSearch] = useState('')

  const {
    isLoading,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters
  } = useAppContext()

  const handleSearch = (e) => {
    /* user will not be able to select something while a request is being performed */   
    handleChange({
      name: e.target.name,
      value: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    clearFilters()
  }

  /* search will only function after 1 second after the last keystroke */
  const debounce = () => {
    let timeOutId;
    return (e) => {
      setLocalSearch(e.target.value)
      clearTimeout(timeOutId)
      timeOutId = setTimeout(() => {
        handleChange({
          name: e.target.name,
          value: e.target.value
        })
      }, 1000)
    }
  }

  // eslint-disable-next-line
  const optimizedDebounce = useMemo(() => debounce(), [])
  

  return (
    <Wrapper>
      <div className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          {/* search position */}
          <FormRow
            type='text'
            name='search'
            value={localSearch}
            handleChange={optimizedDebounce}
          />
          {/* search by status */}
          <FormRowSelect
            labelText='job status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            list={[
              'all',
              ...statusOptions
            ]}
          />
          {/* search by job type */}
          <FormRowSelect
            labelText='job type'
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            list={[
              'all',
              ...jobTypeOptions
            ]}
          />
          {/* sort */}
          <FormRowSelect
            name='sort'
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </div>
    </Wrapper>
  )
}
export default SearchContainer