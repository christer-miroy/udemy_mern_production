import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Register,
  Landing,
  Error,
  ProtectedRoute
} from './pages'
import {
  AddJob,
  AllJobs,
  Profile,
  Stats,
  SharedLayout,
} from './pages/dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard nested page structure */}
        <Route path="/" element={
          /* protected route */
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        }>
          {/* stats as default home page */}
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
