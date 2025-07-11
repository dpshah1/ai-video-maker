from manim import *

class ProposeAndReject(Scene):
    def construct(self):

        title = Text("Propose-and-Reject Algorithm", font_size=36)
        self.play(Write(title))
        self.wait(1)

        timeline = Line(LEFT * 6, RIGHT * 6, stroke_width=4)
        day_labels = [Text(f"Day {i+1}", font_size=24).next_to(timeline, UP) for i in range(5)]
        self.play(Create(timeline))
        self.play(*[Write(day) for day in day_labels])
        self.wait(1)

        jobs = [Square(side_length=1, color=BLUE).shift(LEFT * 4 + UP * i) for i in range(3)]
        candidates = [Square(side_length=1, color=GREEN).shift(RIGHT * 4 + UP * i) for i in range(3)]
        job_labels = [Text(f"Job {i+1}").move_to(job.get_center()) for i, job in enumerate(jobs)]
        candidate_labels = [Text(f"Candidate {i+1}").move_to(candidate.get_center()) for i, candidate in enumerate(candidates)]

        self.play(*[Create(job) for job in jobs])
        self.play(*[Create(candidate) for candidate in candidates])
        self.play(*[Write(label) for label in job_labels])
        self.play(*[Write(label) for label in candidate_labels])
        self.wait(1)

        proposals = [Arrow(start=job.get_right(), end=candidate.get_left(), color=YELLOW) for job, candidate in zip(jobs, candidates)]
        self.play(*[Create(proposal) for proposal in proposals])
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

        lock_in = [Circle(radius=0.6, color=WHITE).move_to(job.get_center()) for job in jobs]
        self.play(*[Create(circle) for circle in lock_in])
        self.wait(1)

        self.play(FadeOut(title), FadeOut(timeline), FadeOut(*jobs), FadeOut(*candidates))
        self.wait(1)

        self.wait(22.6)  # Adjust to ensure total duration is 45.6 seconds