import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true,
}

const Register = () => {
    const navigate = useNavigate()
    const [values, setValues] = useState(initialState)
    
    const {
        user,
        isLoading,
        showAlert,
        displayAlert,
        setupUser
    } = useAppContext()

    /* toggle member */
    const toggleMember = () => {
        setValues({
            ...values,
            isMember: !values.isMember
        })
    }

    /* fire every time the user types */
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const {name, email, password, isMember} = values

        if (!email || !password || (!isMember && !name)) {
            displayAlert()
            return
        }

        const currentUser = {name, email, password}

        if (isMember) {
            /* login */
            setupUser({
                currentUser,
                endPoint: 'login',
                alertText: 'Login Successful! Redirecting to Dashboard...'
            })
        } else {
            /* register */
            setupUser({
                currentUser,
                endPoint: 'register',
                alertText: 'New User Created Successfully! Redirecting to Dashboard...'
            })
        }
    }

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
    }, [user, navigate])

  return (
    <Wrapper className="full-page">
        <form className="form" onSubmit={onSubmit}>
            <Logo />
            <h3>{values.isMember ? 'Login' : 'Register'}</h3>
            {/* show alert here */}
            {showAlert && <Alert />}
            {/* name input field will display if isMember is false */}
            {!values.isMember && (
                    <FormRow
                    type='text'
                    name='name'
                    value={values.name}
                    handleChange={handleChange}
                />
            )}
            {/* email input field */}
            <FormRow
                type='email'
                name='email'
                value={values.email}
                handleChange={handleChange}
            />
            {/* name input field */}
            <FormRow
                type='password'
                name='password'
                value={values.password}
                handleChange={handleChange}
            />
            <button
                type='submit'
                className='btn btn-block'
                disabled={isLoading}
            >
                submit
            </button>
            {/* Test user. All values should be read only */}
            <button
                type="button"
                className="btn btn-block btn-hipster"
                disabled={isLoading}
                onClick={() => {
                    setupUser({
                        currentUser: {
                            email: 'testUser@test.com',
                            password: 'secret'
                        },
                        endPoint: 'login',
                        alertText: 'Login Successful! Redirecting to Dashboard...'
                    })
                }}
            >
                {isLoading ? 'loading...' : 'demo app'}
            </button>
            <p>
                {values.isMember ? 'Not a member yet?' : 'Already a member?'}
                <button
                    type='button'
                    onClick={toggleMember}
                    className='member-btn'
                >
                    {values.isMember ? 'Register' : 'Login'}
                </button>
            </p>
        </form>
    </Wrapper>
  )
};
export default Register;
