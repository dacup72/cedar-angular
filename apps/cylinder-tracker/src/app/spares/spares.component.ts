import { Component, OnInit } from '@angular/core';
import { ProjectsService, Project } from '@cedar-all/core-data';

@Component({
  selector: 'cylinder-tracker-spares',
  templateUrl: './spares.component.html',
  styleUrls: ['./spares.component.css']
})
export class SparesComponent implements OnInit {
  selectedProject: Project;
  primaryColor = 'red';
  projects: Project[];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.getProjects();
  }

  selectProject(project) {
    this.selectedProject = project;
  }

  getProjects() {
    this.projects = this.projectsService.all();
  }

  cancel() {
    this.selectProject(null);
  }
}
