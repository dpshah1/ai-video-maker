from manim import *

class PathAnimation(Scene):
    def construct(self):

        title = Text("Walking, Touring, and Getting Stuck", font_size=36)
        self.play(Write(title))
        self.wait(1)

        subtitle = Text("Paths, Cycles, and Eulerian Tours", font_size=24)
        subtitle.next_to(title, DOWN)
        self.play(Write(subtitle))
        self.wait(1)

        path = Line(start=LEFT * 3, end=RIGHT * 3)
        self.play(Create(path))
        self.wait(0.5)

        dot = Dot(color=BLUE).move_to(path.get_start())
        self.play(FadeIn(dot))

        self.play(dot.animate.move_to(path.get_end()), run_time=2)
        self.wait(0.5)

        stuck_indicator = Circle(radius=0.3, color=RED).move_to(dot.get_center())
        self.play(Transform(dot, stuck_indicator))
        self.wait(0.3)

        self.wait(0.5)