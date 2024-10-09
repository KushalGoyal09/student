import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, UserCircle } from 'lucide-react'

// Mock data for supervisors (replace with actual API call)
const supervisors = [
  { id: 1, name: 'Alka' },
  { id: 2, name: 'Ankit' },
]

// Mock function to fetch permissions (replace with actual API call)
const fetchPermissions = async (supervisorId) => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    UpdateSyllabus: Math.random() < 0.5,
    FeeManagement: Math.random() < 0.5,
    KitDispatch: Math.random() < 0.5,
    AssignMentor: Math.random() < 0.5,
  }
}

export default function RoleManagement() {
  const [selectedSupervisor, setSelectedSupervisor] = useState('')
  const [permissions, setPermissions] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedSupervisor) {
      setLoading(true)
      fetchPermissions(selectedSupervisor).then(perms => {
        setPermissions(perms)
        setLoading(false)
      })
    }
  }, [selectedSupervisor])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800 p-4 sm:p-6 md:p-8">
      <Card className="max-w-md mx-auto bg-purple-100 shadow-lg">
        <CardHeader className="bg-purple-200 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center text-purple-800">Role Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="supervisor-select" className="text-sm font-medium text-purple-700">
                Select Supervisor
              </Label>
              <Select onValueChange={setSelectedSupervisor}>
                <SelectTrigger id="supervisor-select" className="w-full bg-white border-purple-300 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50">
                  <SelectValue placeholder="Choose a supervisor" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {supervisors.map((supervisor) => (
                    <SelectItem key={supervisor.id} value={supervisor.id.toString()} className="focus:bg-purple-100">
                      <div className="flex items-center">
                        <UserCircle className="w-5 h-5 mr-2 text-pink-600" />
                        {supervisor.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSupervisor && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Permissions</h3>
                {loading ? (
                  <motion.div
                    className="flex justify-center items-center py-4"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ChevronDown className="w-8 h-8 text-pink-600" />
                  </motion.div>
                ) : (
                  Object.entries(permissions).map(([key, value]) => (
                    <motion.div key={key} variants={itemVariants} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                      <Label htmlFor={key} className="text-sm font-medium text-purple-700">
                        {key}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(newValue) =>
                          setPermissions((prev) => ({ ...prev, [key]: newValue }))
                        }
                        className="data-[state=checked]:bg-pink-600"
                      />
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}