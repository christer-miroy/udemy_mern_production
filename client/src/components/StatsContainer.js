import StatItem from "./StatItem"
import { useAppContext } from "../context/appContext"
import { FaSuitcaseRolling, FaCalendarCheck, FaThumbsDown } from "react-icons/fa"
import Wrapper from "../assets/wrappers/StatsContainer"

const StatsContainer = () => {
  const { stats } = useAppContext()

  /* default stats array */
  const defaultStats = [
    {
      title: 'pending applications',
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#e9b949',
      bcg: '#fcefc7'
    },
    {
      title: 'scheduled interviews',
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9'
    },
    {
      title: 'jobs declined',
      count: stats.declined || 0,
      icon: <FaThumbsDown />,
      color: '#d66a6a',
      bcg: '#ffeeee'
    }

  ]

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return (
          <StatItem
            key={index}
            {...item}
          />
        )
      })}
    </Wrapper>
  )
}
export default StatsContainer