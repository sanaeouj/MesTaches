import Pomodoro from '../components/Pomodoro'
import TodoList from '../components/TodoList'

export default function Home() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Todo & Pomodoro</h1>
      </header>
      <main className="app__main">
        <Pomodoro />
        <TodoList />
      </main>
    </>
  )
}
