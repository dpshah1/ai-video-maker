from manim import *

class PlanarGraphs(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        planar_graph = Square(side_length=1)
        self.play(Create(planar_graph))
        self.wait(1)

        self.play(planar_graph.animate.shift(LEFT * 2))
        self.wait(0.5)
        self.play(FadeOut(planar_graph))

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        k5_graph = Square(side_length=1)
        self.play(Create(k5_graph))
        self.wait(2)

        self.play(FadeOut(k5_graph))
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        k33_graph = Square(side_length=1)
        self.play(Create(k33_graph))
        self.wait(2)

        euler_title = Text("Euler's Formula: v + f = e + 2").scale(0.6).next_to(k33_graph, DOWN)
        self.play(Write(euler_title))
        self.wait(1)

        vertices = Text("Vertices (v)").next_to(euler_title, DOWN).shift(LEFT * 3)
        edges = Text("Edges (e)").next_to(euler_title, DOWN).shift(RIGHT * 3)
        faces = Text("Faces (f)").next_to(euler_title, DOWN).shift(DOWN * 2)

        self.play(Write(vertices), Write(edges), Write(faces))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.wait(39.2)