import React, { useReducer, useContext, useEffect } from 'react'
import reducer from './reducer'
import axios from 'axios'
import {
    DISPLAY_ALERT,
    CLEAR_ALERT,
    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESS,
    SETUP_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    DELETE_JOB_ERROR,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE,
    GET_CURRENT_USER_BEGIN,
    GET_CURRENT_USER_SUCCESS,
} from './actions'

const initialState = {
    userLoading: true, //used when fetching the current user (refresh the page)
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: null,
    userLocation: '',
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobLocation: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['interview', 'declined', 'pending'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}

const AppContext = React.createContext()

const AppProvider = ({children}) => {
    /* children - passed from parent component */
    const [state, dispatch] = useReducer(reducer, initialState)

    /* axios */
    const authFetch = axios.create({
        baseURL: '/api/v1'
    })

    /* axios interceptors - response */
    authFetch.interceptors.response.use((response) => {
        return response
    },
    (error) => {
        //console.log(error.response)
        if (error.response.status === 401) {
            logoutUser()
        }
        return Promise.reject(error )
    })

    /* display alert */
    const displayAlert = () => {
        dispatch({
            type: DISPLAY_ALERT
        })
        clearAlert()
    }

    /* clear alert */
    const clearAlert = () => {
        setTimeout(() => {
            dispatch({
                type: CLEAR_ALERT
            })
        }, 3000)
    }

    /* register and login user */
    const setupUser = async ({currentUser, endPoint, alertText}) => {
        dispatch({
            type: SETUP_USER_BEGIN
        })
        try{
            const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)

            const {user, location} = data
            dispatch({
                type: SETUP_USER_SUCCESS,
                payload: {
                    user,
                    location,
                    alertText
                },
            })

        } catch(error) {
            dispatch({
                type: SETUP_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
        clearAlert()
    }

    /* toggle sidebar function */
    const toggleSidebar = () => {
        dispatch({
            type: TOGGLE_SIDEBAR
        })
    }

    /* logout function */
    const logoutUser = async () => {
        await authFetch.get('/auth/logout')
        dispatch({
            type: LOGOUT_USER
        })
    }

    /* update user */
    const updateUser = async(currentUser) => {
        dispatch({
            type: UPDATE_USER_BEGIN
        })
        try {
            const { data } = await authFetch.patch('/auth/updateUser', currentUser)
            
            const { user, location } = data

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: {
                    user,
                    location,
                }
            })

        } catch (error) {
            if (error.response.status !== 401) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: { msg :error.response.data.msg }
                })
            }
        }
        clearAlert()
    }

    /* handle change edit job */
    const handleChange = ({name, value}) => {
        dispatch({
            type: HANDLE_CHANGE,
            payload: {
                name,
                value
            }
        })
    }

    /* add job */
    const createJob = async () => {
        dispatch({
            type: CREATE_JOB_BEGIN
        })
        try {
            const {
                position,
                company,
                jobLocation,
                jobType,
                status,
            } = state

            await authFetch.post('/jobs', {
                position,
                company,
                jobLocation,
                jobType,
                status,
            })

            dispatch({
                type: CREATE_JOB_SUCCESS
            })

            dispatch({
                type: CLEAR_VALUES
            })
        } catch (error) {
            if (error.response.status === 401) {
                return
            }
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: {
                    msg: error.response.data.msg
                },
            })
        }
        clearAlert()
    }

    /* clear values */
    const clearValues = () => {
        dispatch({
            type: CLEAR_VALUES
        })
    }

    /* get all jobs */
    const getJobs = async () => {
        /* pull-out values from the state */
        const {
            search,
            searchStatus,
            searchType,
            sort,
            page
        } = state

        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`

        if (search) {
            url = url + `&search=${search}`
        }

        dispatch({
            type: GET_JOBS_BEGIN
        })

        try {
            const {data} = await authFetch.get(url);
            const {
                jobs,
                totalJobs,
                numOfPages
            } = data

            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages
                },
            })

        } catch (error) {
            console.log(error.response)
            logoutUser()
        }

        clearAlert()
    }

    /* placeholder functions (get the id of the job and edit or delete the specific job) */
    const setEditJob = (id) => {
        dispatch({
            type: SET_EDIT_JOB,
            payload: {
                id
            }
        })
    }

    const editJob = async () => {
        dispatch({
            type: EDIT_JOB_BEGIN
        })

        try {
            const {
                position,
                company,
                jobLocation,
                jobType,
                status
            } = state
    
            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status,
            })

            dispatch({
                type: EDIT_JOB_SUCCESS
            })
    
            dispatch({
                type: CLEAR_VALUES
            })
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
        
        clearAlert()
    }

    const deleteJob = async (jobId) => {
        dispatch({
            type: DELETE_JOB_BEGIN
        })

        try {
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs()
        } catch (error) {
            console.log(error.response)
            if (error.response.status === 401) return
            dispatch({
                type: DELETE_JOB_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
        clearAlert()
    }

    /* show stats */
    const showStats = async () => {
        dispatch({
            type: SHOW_STATS_BEGIN
        })
        try {
            const { data } = await authFetch.get('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications
                }
            })
        } catch (error) {
            console.log(error.response)
        }
        clearAlert()
    }

    /* placeholder function - clear search filters */
    const clearFilters = () => {
        dispatch({
            type: CLEAR_FILTERS
        })
    }

    /* change page */
    const changePage = (page) => {
        dispatch({
            type: CHANGE_PAGE,
            payload: {
                page
            }
        })
    }

    /* refresh page without logging out the current user */
    const getCurrentUser = async () => {
        dispatch({
            type: GET_CURRENT_USER_BEGIN
        })

        try {
            const { data } = await authFetch('/auth/getCurrentUser')
            const {
                user,
                location
            } = data

            dispatch({
                type: GET_CURRENT_USER_SUCCESS,
                payload: {
                    user,
                    location
                }
            })
        } catch (error) {
            if (error.response.status === 401) return
            logoutUser()
        }
    }

    useEffect(() => {
        getCurrentUser()
        // eslint-disable-next-line
    }, [])

    return <AppContext.Provider value={{
        ...state,
        displayAlert,
        clearAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage
        }}>
            {/* render children */}
        {children}
    </AppContext.Provider>
}

/* hook setup */
const useAppContext = () => {
    return useContext(AppContext)
}

export {
    AppProvider,
    initialState,
    useAppContext,
}