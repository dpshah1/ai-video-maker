from manim import *

class EmploymentAgency(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        candidate1 = Circle(radius=0.5).shift(LEFT * 3)
        candidate2 = Circle(radius=0.5).shift(LEFT * 1.5)
        candidate3 = Circle(radius=0.5).shift(RIGHT * 1.5)
        candidate4 = Circle(radius=0.5).shift(RIGHT * 3)

        job1 = Square(side_length=1).shift(UP * 2 + LEFT * 3)
        job2 = Square(side_length=1).shift(UP * 2 + LEFT * 1.5)
        job3 = Square(side_length=1).shift(UP * 2 + RIGHT * 1.5)
        job4 = Square(side_length=1).shift(UP * 2 + RIGHT * 3)

        self.play(FadeIn(candidate1, candidate2, candidate3, candidate4, job1, job2, job3, job4))
        self.wait(1)

        arrow1 = Arrow(candidate1.get_bottom(), job1.get_top(), buff=0.1)
        arrow2 = Arrow(candidate2.get_bottom(), job2.get_top(), buff=0.1)
        arrow3 = Arrow(candidate3.get_bottom(), job3.get_top(), buff=0.1)
        arrow4 = Arrow(candidate4.get_bottom(), job4.get_top(), buff=0.1)

        self.play(Create(arrow1), Create(arrow2), Create(arrow3), Create(arrow4))
        self.wait(1)

        preference_table = Table(
            col_labels=["Candidate", "Job", "Preference"],
            include_outer_lines=True
        )

        self.play(Create(preference_table))
        self.wait(1)

        self.play(arrow1.animate.set_color(ORANGE), arrow2.animate.set_color(ORANGE))
        unstable_arrow1 = Arrow(candidate1.get_bottom(), job2.get_top(), buff=0.1, color=ORANGE)
        unstable_arrow2 = Arrow(candidate2.get_bottom(), job1.get_top(), buff=0.1, color=ORANGE)

        self.play(Create(unstable_arrow1), Create(unstable_arrow2))
        self.wait(1)

        self.play(arrow1.animate.set_opacity(0), arrow2.animate.set_opacity(0))
        self.play(unstable_arrow1.animate.set_opacity(0), unstable_arrow2.animate.set_opacity(0))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.wait(47.2 - self.time_elapsed)