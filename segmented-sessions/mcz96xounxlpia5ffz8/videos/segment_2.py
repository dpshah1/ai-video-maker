from manim import *

class GraphTheoryAnimation(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        map_image = Circle(radius=0.5).scale(0.5).next_to(ORIGIN, DOWN)
        self.play(FadeIn(map_image))
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        simple_graph = Square(side_length=1).scale(0.5).next_to(ORIGIN, DOWN)
        self.play(Create(simple_graph))
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        eulerian_path = Line(start=ORIGIN, end=ORIGIN, color=YELLOW)
        self.play(Create(eulerian_path))
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        planar_graph = Square(side_length=1).scale(0.5).next_to(ORIGIN, DOWN)
        self.play(Create(planar_graph))
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        colored_graph = Square(side_length=1).scale(0.5).next_to(ORIGIN, DOWN)
        self.play(Create(colored_graph))
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(2)

        self.wait(5)