import { useState, useEffect } from 'react'
import { moment } from 'moment'
import  { firebase } from '../firebase'
import { collatedTasksExist } from '../helpers'

export const useTasks = (selectedProject) => {
	const [tasks, setTasks] = useState([])
	const [archivedTasks, setArchivedTasks] = useState([])

	// TODO: refactor when auth setup
	useEffect(() => {
		let unsubscribe = firebase.firestore()
		.collection('tasks')
		.where('userId', '==', 'SVGGeU72C5iOMc4WK9xF')

		// TODO: refactor w/o ternaries
		unsubscribe = selectedProject && !collatedTasksExist(selectedProject) ?
		(unsubscribe = unsubscribe.where('projectId', '==', selectedProject)) :
		selectedProject === 'TODAY' ?
		(unsubscribe = unsubscribe.where('date', '==', moment().format('DD/MM/YYYY'))) :
		selectedProject === 'INBOX' || selectedProject === 0 ?
		(unsubscribe = unsubscribe.where('date', '==', '')) :
		unsubscribe

		unsubscribe = unsubscribe.onSnapshot(snapshot => {
			const newTasks = snapshot.docs.map((task) => ({
				id: task.id,
				...task.data()
			}))

			setTasks(
				// TODO: refactor into helper
				selectedProject === 'NEXT_7' ?
					  newTasks.filter((task) => {
						return moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 &&
									 task.archived !== true
					}) :
					newTasks.filter((task) => {
						return task.archived !== true
					})
			)

			setArchivedTasks(newTasks.filter((task)   => task.archived === true))

			return () => unsubscribe()
		})
	}, [selectedProject])

	return { tasks, archivedTasks }
} 

export const useProjects = () => {
	const [projects, setProjects] = useState([])

	useEffect(() => {
		firebase.firestore()
		.collection('projects')
		.where('userId', '==', 'SVGGeU72C5iOMc4WK9xF')
		.orderBy('projectId')
		.get()
		.then((snapshot) => {
			const allProjects = snapshot.docs.map((project) => ({
				...project.data(),
				docId: project.id,
			}))

			if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
				setProjects(allProjects)
			}
		})
	}, [projects])

	return { projects, setProjects }
}