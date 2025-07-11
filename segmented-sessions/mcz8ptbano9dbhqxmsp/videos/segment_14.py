from manim import *

class OptimalityAnimation(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        jobs = VGroup(Text("Job A"), Text("Job B"), Text("Job C")).arrange(DOWN).shift(LEFT * 3)
        candidates = VGroup(Text("Candidate 1"), Text("Candidate 2"), Text("Candidate 3")).arrange(DOWN).shift(RIGHT * 3)
        self.play(Write(jobs), Write(candidates))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        job_score = Text("Job Score: 1, 2, 3").shift(UP * 3)
        candidate_score = Text("Candidate Score: 3, 2, 1").shift(DOWN * 3)
        self.play(Write(job_score), Write(candidate_score))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.wait(20.6)  # Adjust to ensure total duration is 43.6 seconds