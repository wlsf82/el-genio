import { ProjectForm } from '@/components/project-form'
import { Card, CardContent } from '@/components/ui/card'

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto">
      <Card className="max-w-2xl mx-auto my-6">
        <CardContent>
          <h2 className="text-4xl font-medium mb-6">New project</h2>
          <ProjectForm />
        </CardContent>
      </Card>
    </div>
  )
}
