import { openDB, DBSchema } from "idb"

interface UCodeDB extends DBSchema {
  courses: {
    key: number
    value: {
      id: number
      title: string
      content: string
      lastUpdated: number
    }
  }
}

const dbPromise = openDB<UCodeDB>("ucode-offline-db", 1, {
  upgrade(db) {
    db.createObjectStore("courses", { keyPath: "id" })
  },
})

export async function getCourse(id: number) {
  return (await dbPromise).get("courses", id)
}

export async function setCourse(
  id: number,
  course: UCodeDB["courses"]["value"]
) {
  return (await dbPromise).put("courses", course)
}

export async function deleteCourse(id: number) {
  return (await dbPromise).delete("courses", id)
}

export async function clearCourses() {
  return (await dbPromise).clear("courses")
}

export async function getAllCourses() {
  return (await dbPromise).getAll("courses")
}
